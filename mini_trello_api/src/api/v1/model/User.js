class User {
  constructor(email, verificationCode, expire, avt, fullname) {
    this.collection = "users";
    this.email = email;
    this.verificationCode = verificationCode;
    this.expire = expire;
    this.avt = avt;
    this.fullname = fullname;
  }

  static fromJson(json) {
    return new User(
      json.email,
      json.verificationCode,
      json.expire,
      json.avt,
      json.fullname
    );
  }

  static getCollection() {
    return "users";
  }

  toJson() {
    return {
      email: this.email,
      verificationCode: this.verificationCode,
      expire: this.expire,
      avt: this.avt,
      fullname: this.fullname,
    };
  }
}

module.exports = User;
