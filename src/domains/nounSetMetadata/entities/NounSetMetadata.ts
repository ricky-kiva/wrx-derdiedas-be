export interface NounSetMetadataCuratorContacts {
  website: string;
  github: string;
  instagram: string
  linkedin: string;
}

export interface NounSetMetadataCurator {
  name: string;
  role: string;
  contact: NounSetMetadataCuratorContacts;
}

export interface NounSetMetadataPayload {
  name: string;
  version: string;
  description: string;
  dateCreated: string;
  dateUpdated: string;
  source: string;
  curator: NounSetMetadataCurator;
}

export type NounSetMetadataParams = NounSetMetadataPayload;

export default class NounSetMetadata {
  public name: string;
  public version: string;
  public description: string;
  public dateCreated: string;
  public dateUpdated: string;
  public source: string;
  public curator: NounSetMetadataCurator;

  constructor(params: NounSetMetadataParams) {
    const { 
      name, version, description, dateCreated, dateUpdated, source, curator 
    } = params;

    this.name = name;
    this.version = version;
    this.description = description;
    this.dateCreated = dateCreated;
    this.dateUpdated = dateUpdated;
    this.source = source;
    this.curator = curator;
  }
}
