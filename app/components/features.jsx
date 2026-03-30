import { Clock, BarChart3, Users } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-24 text-center">
      <h2 className="text-4xl font-bold mb-4">
        Streamline Your Hiring Process
      </h2>

      <p className="text-gray-500 mb-14">
        AiCruiter helps you save time and find better candidates with our
        advanced AI interview technology.
      </p>

      <div className="grid md:grid-cols-3 gap-8 px-10 max-w-6xl mx-auto">
        <Card
          icon={<Clock size={40} />}
          title="Save Time"
          desc="Automate initial screening interviews and focus on final candidates."
        />

        <Card
          icon={<BarChart3 size={40} />}
          title="Data-Driven Insights"
          desc="Get detailed analytics and candidate comparisons based on interview responses."
        />

        <Card
          icon={<Users size={40} />}
          title="Reduce Bias"
          desc="Standardized interviews help eliminate unconscious bias in the hiring process."
        />
      </div>
    </section>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all hover:-translate-y-2 hover:border-blue-500/30">
      <div className="text-blue-500 flex justify-center mb-4">{icon}</div>

      <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>

      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
