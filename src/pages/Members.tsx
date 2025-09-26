export const Members: React.FC = () => {
  const { loading, getMembers } = useApi();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    getMembers().then(setMembers);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando miembros..." />;
  }

  return (
    <main className="p-6">
      <h1>Miembros ({members.length})</h1>
      <ul>
        {members.map(m => (
          <li key={m.id}>{m.name} ({m.role})</li>
        ))}
      </ul>
    </main>
  );
};
