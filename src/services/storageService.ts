import { saveEvidenceFile, readEvidenceFile } from './localStore';

export const storageService = {
  save: saveEvidenceFile,
  read: readEvidenceFile,
};
