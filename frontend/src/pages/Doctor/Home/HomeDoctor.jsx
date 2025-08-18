export default function Doctor() {
  const doctorName = localStorage.getItem("doctorName");

  return (
    <div>
      <h1>Área do Médico</h1>
      <p>Bem-vindo, Dr. {doctorName} ao seu painel!</p>
    </div>
  );
}