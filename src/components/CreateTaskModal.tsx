import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { employees, departments, addTask, fetchEmployees, fetchDepartments, tasks, fetchTasks } = useDataStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedToId: '',
    originatorId: '',
    departmentId: '',
    sourceDepartmentId: '',
    dueDate: '',
    parentTaskId: '',
    category: 'Parnica',
    caseNumber: '',
    registrarId: '',
    smilAssigneeId: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchDepartments();
      fetchTasks();
    }
  }, [isOpen, fetchEmployees, fetchDepartments, fetchTasks]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTask(formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      assignedToId: '',
      originatorId: '',
      departmentId: '',
      sourceDepartmentId: '',
      dueDate: '',
      parentTaskId: '',
      category: 'Parnica',
      caseNumber: '',
      registrarId: '',
      smilAssigneeId: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Novi unos predmeta</h2>
            <p className="text-xs text-gray-500">Registrujte novi predmet ili zadatak u sistemu</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Section: Case Identity */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <div className="w-1 h-4 bg-[#00FF00] rounded-full" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identitet predmeta</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Naslov / Predmet</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors font-medium text-sm"
                    placeholder="npr. Parnični postupak - Tužba"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Broj predmeta</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors font-mono text-sm"
                    placeholder="2024-PR-001"
                    value={formData.caseNumber}
                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Kategorija i boja fascikle</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Parnica', color: 'bg-green-500', border: 'border-green-600' },
                    { name: 'Krivica', color: 'bg-pink-500', border: 'border-pink-600' },
                    { name: 'Prekršaji', color: 'bg-white', border: 'border-gray-300' }
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.name as any })}
                      className={`relative flex items-center justify-center py-3 px-4 rounded-xl border-2 transition-all ${
                        formData.category === cat.name 
                          ? `${cat.border} ring-4 ring-[#00FF00]/10 scale-[1.02]` 
                          : 'border-transparent bg-gray-50 opacity-60 grayscale-[0.3]'
                      }`}
                    >
                      <div className={`absolute left-3 w-3 h-3 rounded-full ${cat.color} ${cat.name === 'Prekršaji' ? 'border border-gray-300' : ''}`} />
                      <span className={`text-xs font-bold ml-4 ${formData.category === cat.name ? 'text-gray-900' : 'text-gray-500'}`}>
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: Roles & Assignment */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uloge i dodela</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Referent (Zapisničar)</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm"
                    value={formData.registrarId}
                    onChange={(e) => setFormData({ ...formData, registrarId: e.target.value })}
                  >
                    <option value="">Izaberi referenta</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">SMIL izvršilac (Sudija)</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm"
                    value={formData.smilAssigneeId}
                    onChange={(e) => setFormData({ ...formData, smilAssigneeId: e.target.value })}
                  >
                    <option value="">Izaberi sudiju</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Trenutni obrađivač</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm"
                    value={formData.assignedToId}
                    onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                  >
                    <option value="">Izaberi obrađivača</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Source & Logistics */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <div className="w-1 h-4 bg-orange-500 rounded-full" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Izvor i logistika</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Podnosilac (Izvor)</p>
                  <div className="grid grid-cols-1 gap-3">
                    <select
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm bg-white"
                      value={formData.sourceDepartmentId}
                      onChange={(e) => setFormData({ ...formData, sourceDepartmentId: e.target.value, originatorId: '' })}
                    >
                      <option value="">Izvorna organizacija</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    <select
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm bg-white"
                      value={formData.originatorId}
                      onChange={(e) => setFormData({ ...formData, originatorId: e.target.value })}
                      disabled={!formData.sourceDepartmentId}
                    >
                      <option value="">Izvorna osoba / Sudija</option>
                      {employees
                        .filter(emp => emp.departmentId === formData.sourceDepartmentId)
                        .map((emp) => (
                          <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Cilj i rokovi</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        required
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm bg-white"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="Low">Nizak prioritet</option>
                        <option value="Medium">Srednji prioritet</option>
                        <option value="High">Visok prioritet</option>
                      </select>
                      <input
                        type="date"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm bg-white"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
                    </div>
                    <select
                      required
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm bg-white"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    >
                      <option value="">Ciljno odeljenje</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Additional Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <div className="w-1 h-4 bg-gray-400 rounded-full" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dodatni detalji</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Opis / Napomene</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm"
                    rows={3}
                    placeholder="Unesite dodatne informacije..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Veza sa postojećim predmetom</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#00FF00] focus:ring-0 transition-colors text-sm"
                    value={formData.parentTaskId}
                    onChange={(e) => setFormData({ ...formData, parentTaskId: e.target.value })}
                  >
                    <option value="">Bez veze</option>
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>{t.caseNumber ? `[${t.caseNumber}] ` : ''}{t.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-[#00FF00] text-black rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#00FF00]/20 transition-all active:scale-95"
          >
            Kreiraj unos predmeta
          </button>
        </div>
      </div>
    </div>
  );
}
