import { create } from 'ipfs-http-client';

// Configuración de IPFS utilizando el cliente HTTP
export class IPFSStorage {
  private ipfs: any;

  constructor() {
    this.init();
  }

  // Inicializa la conexión con un nodo IPFS a través del cliente HTTP
  private async init() {
    // Configurar el cliente de IPFS con la URL de Infura (u otro nodo)
    this.ipfs = create({
      url: 'https://ipfs.infura.io:5001/api/v0',  // Nodo IPFS público de Infura
    });
  }

  // Subir contenido y metadatos a IPFS
  public async uploadContent(content: Buffer | null, metadata: any): Promise<{ contentHash: string; metadataHash: string }> {
    let contentHash = '';
    if (content) {
      const file = await this.ipfs.add(content);
      contentHash = file.path;  // El CID del archivo subido
    }

    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const metadataFile = await this.ipfs.add(metadataBuffer);
    const metadataHash = metadataFile.path;

    return { contentHash, metadataHash };
  }

  // Obtener contenido de IPFS usando el hash del contenido
  public async getContent(contentHash: string): Promise<Buffer> {
    const content = await this.ipfs.cat(contentHash);
    return content;
  }

  // Obtener metadatos de IPFS usando el hash de los metadatos
  public async getMetadata(metadataHash: string): Promise<any> {
    const metadata = await this.ipfs.cat(metadataHash);
    return JSON.parse(metadata.toString());
  }
}
