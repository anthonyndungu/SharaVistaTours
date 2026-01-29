export default function Stats({ stats }) {
  return (
    <div className="bg-primary-600">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-primary-100 text-sm md:text-base">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}