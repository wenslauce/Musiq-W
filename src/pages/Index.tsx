
import { Play } from "lucide-react";

const FeaturedCard = ({ title, description, image }: { title: string; description: string; image: string }) => (
  <div className="spotify-card group">
    <img src={image} alt={title} className="spotify-card-image" />
    <h3 className="font-semibold truncate">{title}</h3>
    <p className="text-sm text-muted-foreground truncate">{description}</p>
    <button className="w-12 h-12 rounded-full bg-primary absolute bottom-6 right-6 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
      <Play className="w-6 h-6 text-primary-foreground" />
    </button>
  </div>
);

const Index = () => {
  const featuredPlaylists = [
    {
      title: "Today's Top Hits",
      description: "The most popular tracks right now",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    },
    {
      title: "RapCaviar",
      description: "New music from Lil Baby, Gunna and more",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    },
    {
      title: "All Out 2010s",
      description: "The biggest songs of the 2010s",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    },
    {
      title: "Rock Classics",
      description: "Rock legends & epic songs",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-background p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Good evening</h1>
        <p className="text-muted-foreground">Welcome back</p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPlaylists.map((playlist) => (
            <FeaturedCard key={playlist.title} {...playlist} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Made for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPlaylists.map((playlist) => (
            <FeaturedCard key={playlist.title} {...playlist} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recently Played</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPlaylists.map((playlist) => (
            <FeaturedCard key={playlist.title} {...playlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
