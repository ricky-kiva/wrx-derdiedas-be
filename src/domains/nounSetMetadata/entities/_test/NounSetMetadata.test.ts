import NounSetMetadata, { NounSetMetadataParams, NounSetMetadataPayload } from '../NounSetMetadata';

describe('NounSetMetadata', () => {
  it('should create an object correctly', () => {
    const nounSetMetadataPayload: NounSetMetadataPayload = {
      name: "derdiedas-dataset",
      version: "1.0.0",
      dateCreated: "2025-06-22T12:41Z",
      dateUpdated: "2025-07-02T08:21Z",
      description: "A list of German nouns with gender & meanings",
      source: "https://kaikki.org/",
      curator: {
        name: "Rickyslash",
        role: "Extracted nouns along with their gender and meanings from a large raw linguistic dataset",
        contact: {
          website: "https://rickyslash.my.id/",
          github: "https://github.com/ricky-kiva",
          instagram: "https://www.instagram.com/r.ckyslash/",
          linkedin: "https://www.linkedin.com/in/ricky-fadel/"
        }
      }
    };

    const nounSetMetadataParams: NounSetMetadataParams = { ...nounSetMetadataPayload };

    const nounSetMetadata = new NounSetMetadata(nounSetMetadataParams);

    expect(nounSetMetadata.name).toBe(nounSetMetadataPayload.name);
    expect(nounSetMetadata.version).toBe(nounSetMetadataPayload.version);
    expect(nounSetMetadata.dateCreated).toBe(nounSetMetadataPayload.dateCreated);
    expect(nounSetMetadata.dateUpdated).toBe(nounSetMetadataPayload.dateUpdated);
    expect(nounSetMetadata.description).toBe(nounSetMetadataPayload.description);
    expect(nounSetMetadata.source).toBe(nounSetMetadataPayload.source);
  
    expect(nounSetMetadata.curator.name).toBe(nounSetMetadataPayload.curator.name);
    expect(nounSetMetadata.curator.role).toBe(nounSetMetadataPayload.curator.role);

    expect(nounSetMetadata.curator.contact.website).toBe(nounSetMetadataPayload.curator.contact.website);
    expect(nounSetMetadata.curator.contact.github).toBe(nounSetMetadataPayload.curator.contact.github);
    expect(nounSetMetadata.curator.contact.instagram).toBe(nounSetMetadataPayload.curator.contact.instagram);
    expect(nounSetMetadata.curator.contact.linkedin).toBe(nounSetMetadataPayload.curator.contact.linkedin);
  });
});
