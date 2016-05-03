'use babel';

import fs from 'fs';
import md5 from 'md5';
import { projectsFile, ProjectRepository } from '../lib/project-repository';

describe('project repository', () => {
  beforeEach(() => {
    if (fs.existsSync(projectsFile)) {
      fs.unlinkSync(projectsFile);
    }
  });
  afterEach(() => {
    if (fs.existsSync(projectsFile)) {
      fs.unlinkSync(projectsFile);
    }
  });
  it('should init list as empty and create a file on initial query', () => {
    const projectRepository = new ProjectRepository();
    expect(projectRepository.listProjects()).toEqual([]);
    expect(projectsFile).toExistOnDisk();
  });
  it('should create a new project given a name and directories list', () => {
    const projectRepository = new ProjectRepository();
    const directories = [{ path: '/my/awesome/path' }];
    const name = 'myNewAwesomeProject';
    expect(projectRepository.listProjects().length).toEqual(0);
    projectRepository
      .saveProject({ name, directories })
      .then((res) => {
        expect(res).toEqual([{
          id: md5(directories[0].path),
          name,
          directories,
        }]);
        expect(projectRepository.listProjects().length).toEqual(1);
      });
  });
  it('should not create a new project given the project already exists', () => {
    const projectRepository = new ProjectRepository();
    const directories = [{ path: '/my/awesome/path' }];
    const name = 'myNewAwesomeProject';
    expect(projectRepository.listProjects().length).toEqual(0);
    projectRepository
      .saveProject({ name, directories })
      .then(() => {
        expect(projectRepository.listProjects().length).toEqual(1);
        return projectRepository.saveProject({ name, directories });
      })
      .then(() => expect(projectRepository.listProjects().length).toEqual(1));
  });
  it('should find a project by id', () => {
    const projectRepository = new ProjectRepository();
    const directories = [{ path: '/my/awesome/path' }];
    const name = 'myNewAwesomeProject';
    expect(projectRepository.listProjects().length).toEqual(0);
    projectRepository
      .saveProject({ name, directories })
      .then(() => projectRepository.findProject(md5(directories[0].path)))
      .then((project) => {
        console.log(project);
        expect(project).toEqual({
          id: md5(directories[0].path),
          name,
          directories,
        });
      });
  });
});
