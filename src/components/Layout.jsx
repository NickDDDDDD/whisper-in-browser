const Layout = ({ children }) => {
  return (
    <div className="h-dvh w-dvw">
      <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-zinc-900 to-zinc-950">
        {children}
      </div>
    </div>
  );
};

export default Layout;
