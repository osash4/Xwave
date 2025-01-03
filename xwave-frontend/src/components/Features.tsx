import { Music, Video, Gamepad } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Features = () => {
  const features = [
    { icon: <Music size={48} />, title: 'Music Streaming', description: 'Listen to your favorite tracks and discover new artists.', path:'/music' },
    { icon: <Video size={48} />, title: 'Video Streaming', description: 'Enjoy HD videos, movies, and exclusive content.', path: '/video'  },
    { icon: <Gamepad size={48} />, title: 'Gaming', description: 'Play games directly within the platform and earn rewards.', path: '/gaming' }
  ];

  return (
    <section className="flex justify-around flex-wrap p-10 bg-[#1d475f] text-[#d2e9ed]">
      {features.map((feature, index) => (
        <Link key={index} to={feature.path}>
          <div
            className="text-center flex-1 p-8 m-4 bg-[#2483ad] rounded-lg transition-all duration-300 hover:bg-[#3ecadd] 
                       shadow-lg hover:shadow-xl min-w-[250px] max-w-[300px] transform hover:scale-105"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-2xl text-white mb-2">{feature.title}</h3>
            <p className="text-lg">{feature.description}</p>
          </div>
        </Link>
      ))}
    </section>
  );
};
