import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TileGeneratorService {
  private readonly alphabet = ['A', 'B', 'C', 'D', 'E',
  'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y',
  'Z'];

  constructor() { }

  public generateLegendTiles(fieldSize: number): string[] {
    const alphabetCopy: string[] = JSON.parse(JSON.stringify(this.alphabet));
    return alphabetCopy.splice(0, fieldSize);
  }
}
