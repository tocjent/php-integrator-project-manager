'use babel';

import md5 from 'md5';
import _ from 'lodash';
import low from 'lowdb';
import storage from 'lowdb/file-async';

export const projectsFile = `${atom.getConfigDirPath()}/php-integrator-projects.json`;
export class ProjectRepository {
  constructor() {
    this.db = low(projectsFile, { storage }, true);
    this.db.write();
  }

  listProjects() {
    return this.db('projects').value();
  }

  findProject(id) {
    return this.db('projects').find({ id });
  }

  saveProject(project) {
    const projectId = this.generateId(project.directories);
    const newProject = {
      id: projectId,
      directories: project.directories.map((d) => d.path),
      name: project.name,
    };
    const projectPromise = this.db('projects').find({ id: projectId });
    if (_.has(projectPromise, 'then')) {
      return projectPromise
        .then((existingProject) => {
          if (_.isUndefined(existingProject)) {
            return this.db('projects').insert(newProject);
          }
          return this.db('projects')
            .find({ id: projectId })
            .assign(newProject);
        });
    }
    return projectPromise;
  }

  generateId(directories) {
    const paths = directories
      .filter((dir) => dir.path.indexOf('atom://') !== 0)
      .join('');
    return md5(paths);
  }
}
