class Board {
  constructor({ id, name, members }) {
    this.id = id;
    this.name = name;
    this.members = members;
  }

  static fromJson(json) {
    return new Board(json);
  }

  static getCollection() {
    return "boards";
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      members: this.members,
    };
  }
}

module.exports = Board;
