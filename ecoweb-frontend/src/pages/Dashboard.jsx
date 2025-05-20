import PageCard from '../components/PageCard';

const results = [
  {
    url: 'https://example.com',
    co2: 1.2,
    pageWeight: 456,
    requestCount: 32,
    greenHost: true,
    score: 85,
  },
  {
    url: 'https://another-site.com',
    co2: 3.4,
    pageWeight: 789,
    requestCount: 45,
    greenHost: false,
    score: 40,
  },
];

export default function Dashboard() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      {results.map((result) => (
        <PageCard key={result.url} {...result} />
      ))}
    </div>
  );
}
