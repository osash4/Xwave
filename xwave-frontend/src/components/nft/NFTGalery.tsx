
import { NFT} from '../../types/types'

// Definiendo el tipo para la propiedad `nfts` y la función `onTransfer`
interface NFTGalleryProps {
  nfts: NFT[];  // Asegúrate de que nfts esté tipado como un array de NFT
  onTransfer: (nft: NFT) => void;  // La función onTransfer espera un objeto NFT
}

export function NFTGallery({ nfts, onTransfer }: NFTGalleryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">NFT Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div key={nft.id} className="border rounded-lg p-4">
            <img 
              src={nft.imageUrl || 'default-image-url'}  // Default image in case imageUrl is undefined
              alt={typeof nft.name === 'string' ? nft.name : 'NFT Image'} // Fallback value for alt
              className="w-full h-48 object-cover mb-4" 
            />
            <h3 className="text-xl">{nft.name || 'Untitled NFT'}</h3> {/* Fallback text for name */}
            <button
              className="mt-2 text-blue-500"
              onClick={() => onTransfer(nft)}  // Aquí se pasa un objeto NFT
            >
              Transfer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
