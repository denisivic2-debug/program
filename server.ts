import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./src/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "enterprise-secret-key";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // --- API ROUTES ---

  // Auth
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", authenticate, async (req, res) => {
    const totalTasks = await prisma.task.count();
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: true
    });
    const overdueTasks = await prisma.task.count({
      where: { dueDate: { lt: new Date() }, status: { not: "Completed" } }
    });
    const totalEmployees = await prisma.employee.count();
    
    res.json({ totalTasks, tasksByStatus, overdueTasks, totalEmployees });
  });

  // Tasks
  app.get("/api/tasks", authenticate, async (req, res) => {
    const tasks = await prisma.task.findMany({
      include: { 
        assignedTo: true, 
        originator: true,
        registrar: true,
        smilAssignee: true,
        createdBy: true, 
        department: true,
        history: {
          orderBy: { createdAt: 'desc' }
        },
        parentTask: true,
        childTasks: true
      }
    });
    res.json(tasks);
  });

  app.post("/api/tasks", authenticate, async (req, res) => {
    const { 
      title, description, priority, assignedToId, originatorId, 
      departmentId, dueDate, parentTaskId,
      category, caseNumber, registrarId, smilAssigneeId
    } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        assignedToId,
        originatorId,
        departmentId,
        parentTaskId,
        category,
        caseNumber,
        registrarId,
        smilAssigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: (req as any).user.id,
      }
    });
    
    // Record creation in history
    const assigneeName = task.assignedToId ? "assigned" : "unassigned";
    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        changedBy: (req as any).user.email,
        changeType: "Creation",
        newValue: `Task created and ${assigneeName}`
      }
    });

    res.json(task);
  });

  app.patch("/api/tasks/:id/status", authenticate, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const oldTask = await prisma.task.findUnique({ where: { id } });
    const task = await prisma.task.update({
      where: { id },
      data: { status }
    });
    await prisma.taskHistory.create({
      data: {
        taskId: id,
        changedBy: (req as any).user.email,
        changeType: "StatusChange",
        oldValue: oldTask?.status,
        newValue: status
      }
    });
    res.json(task);
  });

  app.patch("/api/tasks/:id/assign", authenticate, async (req, res) => {
    const { id } = req.params;
    const { assignedToId } = req.body;
    
    const oldTask = await prisma.task.findUnique({ 
      where: { id },
      include: { assignedTo: true }
    });
    
    const task = await prisma.task.update({
      where: { id },
      data: { assignedToId },
      include: { assignedTo: true }
    });

    const oldName = oldTask?.assignedTo ? `${oldTask.assignedTo.firstName} ${oldTask.assignedTo.lastName}` : "Unassigned";
    const newName = task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : "Unassigned";

    await prisma.taskHistory.create({
      data: {
        taskId: id,
        changedBy: (req as any).user.email,
        changeType: "AssignmentChange",
        oldValue: oldName,
        newValue: newName
      }
    });

    res.json(task);
  });

  app.delete("/api/tasks/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.json({ success: true });
  });

  // Employees
  app.get("/api/employees", authenticate, async (req, res) => {
    const employees = await prisma.employee.findMany({ include: { department: true } });
    res.json(employees);
  });

  app.post("/api/employees", authenticate, async (req, res) => {
    const { firstName, lastName, email, phone, position, departmentId, status } = req.body;
    try {
      const employee = await prisma.employee.create({
        data: { firstName, lastName, email, phone, position, departmentId, status: status || "Active" }
      });
      res.json(employee);
    } catch (err) {
      res.status(400).json({ error: "Failed to create employee" });
    }
  });

  app.patch("/api/employees/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const employee = await prisma.employee.update({ where: { id }, data });
    res.json(employee);
  });

  app.delete("/api/employees/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    await prisma.employee.delete({ where: { id } });
    res.json({ success: true });
  });

  // Departments
  app.get("/api/departments", authenticate, async (req, res) => {
    const departments = await prisma.department.findMany({
      include: { _count: { select: { employees: true } } }
    });
    res.json(departments);
  });

  app.post("/api/departments", authenticate, async (req, res) => {
    const { name, description } = req.body;
    try {
      const department = await prisma.department.create({
        data: { name, description }
      });
      res.json(department);
    } catch (err) {
      res.status(400).json({ error: "Failed to create department" });
    }
  });

  app.patch("/api/departments/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const department = await prisma.department.update({
      where: { id },
      data: { name, description }
    });
    res.json(department);
  });

  app.delete("/api/departments/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.department.delete({ where: { id } });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Cannot delete department with employees" });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // --- BOOTSTRAP ADMIN ---
  const adminEmail = "admin@enterprise.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const dept = await prisma.department.create({
      data: { name: "Administration", description: "Main administration department" }
    });
    const emp = await prisma.employee.create({
      data: {
        firstName: "System",
        lastName: "Admin",
        email: adminEmail,
        position: "Administrator",
        departmentId: dept.id
      }
    });
    await prisma.user.create({
      data: {
        username: "admin",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "Admin",
        employeeId: emp.id
      }
    });
    console.log("Bootstrap admin created: admin@enterprise.com / admin123");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
