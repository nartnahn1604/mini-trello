class Task {
  constructor(id, parent, index, title, members) {
    this.id = id;
    this.parent = parent;
    this.index = index;
    this.title = title;
    this.members = members;
  }

  static fromJson(json) {
    return new Task(json.id, json.parent, json.index, json.title, json.members);
  }

  toJson() {
    return {
      id: this.id,
      parent: this.parent,
      index: this.index,
      title: this.title,
      ...(this.members ? { members: this.members } : {}),
    };
  }

  static getCollection() {
    return "tasks";
  }
}

module.exports = Task;
