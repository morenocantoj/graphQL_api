class Champion {
  constructor(name, attackDamage) {
    this.name = name
    this.attackDamage = attackDamage
  }

  set name(name) {
    this._name = name
  }

  get name() {
    return this._name
  }

  set attackDamage(attackDamage) {
    this._attackDamage = attackDamage
  }

  get attackDamage() {
    return this._attackDamage
  }
}

module.exports = Champion
