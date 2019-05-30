export class Ship {
  public isSunken = false;

  constructor(public horizontal: boolean,
              public rowIndex: number,
              public columnIndex: number,
              public shipIndex: number,
              public size: number) {
  }

  public comprises(intermediateRowIndex: number,
                   intermediateColumnIndex: number) {
    let shipSizeToIntermediateLength;
    if (this.horizontal) {
      if (this.rowIndex === intermediateRowIndex) {
        shipSizeToIntermediateLength = (intermediateColumnIndex - this.columnIndex);
        if (shipSizeToIntermediateLength < this.size &&
          shipSizeToIntermediateLength >= 0) {
          return true;
        }
      }
    } else {
      if (this.columnIndex === intermediateColumnIndex) {
        shipSizeToIntermediateLength = (intermediateRowIndex - this.rowIndex);
        if (shipSizeToIntermediateLength < this.size &&
          shipSizeToIntermediateLength >= 0) {
          return true;
        }
      }
    }
    return false;
  }

}
