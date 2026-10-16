interface StatCardProps {
    title: string,
    value: string;
};


function StatCard ({title, value}: StatCardProps) {
    return (
    <div className="statCard">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
    )
};

export default StatCard;