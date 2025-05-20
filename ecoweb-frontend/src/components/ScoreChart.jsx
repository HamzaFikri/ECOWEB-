// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// function ScoreChart({ pages = [], results = {} }) {
//   if (!Array.isArray(pages) || pages.length === 0) {
//     return <p className="text-gray-500">Aucune donnée pour le graphique.</p>;
//   }

//   const data = pages
//     .map((page) => {
//       const result = results[page.id];
//       if (!result) return null;
//       return {
//         name: page.url.slice(0, 30), // limite affichage
//         score: result.score,
//       };
//     })
//     .filter(Boolean); // supprime les null

//   return (
//     <div className="bg-white p-4 rounded shadow mb-6">
//       <h2 className="text-lg font-semibold mb-4">📈 Évolution des scores</h2>
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={data}>
//           <XAxis dataKey="name" />
//           <YAxis domain={[0, 100]} />
//           <Tooltip />
//           <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default ScoreChart;



// ******************************  circle charts *********************


// import {
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// function ScoreChart({ pages = [], results = {} }) {
//   if (!Array.isArray(pages) || pages.length === 0) {
//     return <p className="text-gray-500">Aucune donnée pour le graphique.</p>;
//   }

//   const data = pages
//     .map((page) => {
//       const result = results[page.id];
//       if (!result) return null;
//       return {
//         name: page.url.slice(0, 30), // nom court
//         value: result.score, // le score sera affiché
//       };
//     })
//     .filter(Boolean);

//   const COLORS = ["#10b981", "#facc15", "#ef4444", "#60a5fa", "#a855f7"];

//   return (
//     <div className="bg-white p-4 rounded shadow mb-6">
//       <h2 className="text-lg font-semibold mb-4">🟢 Répartition des scores</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             outerRadius={100}
//             label
//             dataKey="value"
//           >
//             {data.map((_, index) => (
//               <Cell key={index} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default ScoreChart;



// *****************************************************************


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ScoreChart({ pages = [], results = {} }) {
  if (!Array.isArray(pages) || pages.length === 0) {
    return <p className="text-gray-500">Aucune donnée pour le graphique.</p>;
  }

  const getColorByScore = (score) => {
    if (score >= 80) return "#10b981"; // Vert
    if (score >= 50) return "#facc15"; // Jaune
    return "#ef4444"; // Rouge
  };

  const data = pages
    .map((page) => {
      const result = results[page.id];
      if (!result) return null;
      return {
        name: page.url.slice(0, 30),
        value: result.score,
        color: getColorByScore(result.score),
      };
    })
    .filter(Boolean);

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">🟢 Répartition des scores</h2>

      {/* Légende personnalisée */}
      <div className="mb-4 flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
          <span>Score élevé (80-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
          <span>Score moyen (50-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          <span>Score faible (0-49)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({  value }) => `${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreChart;

