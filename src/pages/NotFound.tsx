import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Compass, Home, Briefcase, Rss } from 'lucide-react'; // Optional icons

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vizualiza-bg-dark text-white p-6">
      <Helmet>
        <title>Página Não Encontrada | Vizualiza</title>
        <meta name="description" content="Parece que você se perdeu no universo visual. Volte para a página inicial ou explore outras seções do Vizualiza." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Página Não Encontrada | Vizualiza" />
        <meta property="og:description" content="Parece que você se perdeu no universo visual. Explore o Vizualiza." />
      </Helmet>
      <div className="text-center max-w-lg">
        <h1 className="text-3xl sm:text-4xl font-bold bg-vizualiza-gradient bg-clip-text text-transparent mb-8">
          Vizualiza
        </h1>

        <Compass size={64} className="text-vizualiza-purple mx-auto mb-8 animate-pulse" />

        <h2 className="text-5xl sm:text-6xl font-bold text-vizualiza-purple mb-4">404</h2>
        <p className="text-2xl sm:text-3xl text-gray-200 mb-6">Página Não Encontrada</p>
        <p className="text-lg text-gray-400 mb-10">
          Parece que você se perdeu no universo visual. Mas não se preocupe, estamos aqui para te guiar de volta!
        </p>

        <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          <Button asChild variant="default" size="lg" className="w-full sm:w-auto bg-vizualiza-purple hover:bg-vizualiza-purple-dark transition-all duration-300 group">
            <Link to="/">
              <Home className="w-4 h-4 mr-2 group-hover:animate-bounce-horizontal" />
              Voltar para Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-vizualiza-orange text-vizualiza-orange hover:bg-vizualiza-orange hover:text-white transition-all duration-300 group">
            <a href="/#portfolio">
              <Briefcase className="w-4 h-4 mr-2 group-hover:animate-bounce-vertical" />
              Ver Portfólio
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-vizualiza-green text-vizualiza-green hover:bg-vizualiza-green hover:text-white transition-all duration-300 group">
            <a href="/#blog">
              <Rss className="w-4 h-4 mr-2 group-hover:animate-pulse-fast" />
              Nosso Blog
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
