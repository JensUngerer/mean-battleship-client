export class Ship {
  public isSunken = false;

  constructor(public horizontal: boolean,
              public rowIndex: number,
              public columnIndex: number,
              public shipIndex: number,
              public size: number) {
  }
}
