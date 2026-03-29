export const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto p-4 w-full">
      <p className="text-foreground font-semibold text-xs ">
        &copy; {new Date().getFullYear()} Barbearia. Todos os direitos
        reservados.
      </p>
      <p className="text-muted-foreground font-light text-xs">
        Desenvolvido por Diego Martins
      </p>
    </footer>
  );
};
