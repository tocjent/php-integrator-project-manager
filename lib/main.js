'use babel';

import { CompositeDisposable } from 'atom';
import ProjectRepository from './project-repository';

export default class Main {
  static activate() {
    this.subscriptions = new CompositeDisposable();
    this.projectRepository = new ProjectRepository();
  }

  static deactivate() {
    this.subscriptions.dispose();
  }

  static registerEvents() {
    const events = [];
    events.forEach((event) => this.subscriptions.add(event));
  }

  static registerCommands() {
    const commands = [];
    commands.forEach((command) => this.subscriptions.add(command));
  }

  static dispose() {
    this.subscriptions.dispose();
  }
}
