import React, { useState } from 'react';

const HorarioN = () => {
  const [draggingMateria, setDraggingMateria] = useState(null);
  const [schedule, setSchedule] = useState({});

  const handleDragStart = (materia) => {
    setDraggingMateria(materia);
  };

  const handleDrop = (day, hour) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [`${day}-${hour}`]: draggingMateria,
    }));
    setDraggingMateria(null);
  };

  const horas = [];
  for (let i = 7; i <= 22; i++) {
    let hora = i;
    let periodo = 'AM';
    if (i === 12) {
      periodo = 'PM';
    } else if (i > 12) {
      hora = i - 12;
      periodo = 'PM';
    }
    horas.push(`${hora}:00 ${periodo}`);
  }

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const materias = [
    { nombre: 'Matemáticas', color: 'bg-blue-500' },
    { nombre: 'Historia', color: 'bg-green-500' },
    { nombre: 'Ciencias', color: 'bg-red-500' },
    { nombre: 'Arte', color: 'bg-yellow-500' }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto mb-4">
        <div className="flex space-x-4">
          {materias.map((materia, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(materia.nombre)}
              className={`flex-shrink-0 w-32 h-16 ${materia.color} text-white flex items-center justify-center rounded-md shadow-md cursor-pointer`}
            >
              {materia.nombre}
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
              {dias.map(dia => (
                <th key={dia} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {horas.map(hora => (
              <tr key={hora}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hora}</td>
                {dias.map(dia => (
                  <td
                    key={dia}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(dia, hora)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 relative"
                  >
                    {schedule[`${dia}-${hora}`] && (
                      <div
                        className={`absolute inset-0 bg-indigo-500 text-white flex items-center justify-center rounded-md shadow-md`}
                      >
                        {schedule[`${dia}-${hora}`]}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HorarioN;
