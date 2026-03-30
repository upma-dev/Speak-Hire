"use client";

import { motion } from "framer-motion";
import { Users, Video, Clock } from "lucide-react";

const stats = [
  { title: "Total Interviews", value: "24", icon: Video },
  { title: "Candidates", value: "132", icon: Users },
  { title: "Avg Duration", value: "32m", icon: Clock },
];

export default function StatsOverview() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass-card rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Icon className="text-blue-400" />
            </div>

            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
