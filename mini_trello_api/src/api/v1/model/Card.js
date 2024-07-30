class Card {
  constructor(id, parent, index, title, tasks) {
    this.id = id;
    this.parent = parent;
    this.index = index;
    this.title = title;
    this.tasks = tasks;
  }

  static fromJson(json) {
    return new Card(json.id, json.parent, json.index, json.title, json.tasks);
  }

  toJson() {
    return {
      id: this.id,
      parent: this.parent,
      index: this.index,
      title: this.title,
      ...(this.tasks ? { tasks: this.tasks } : {}),
    };
  }

  static getCollection() {
    return "cards";
  }
}

module.exports = Card;
