import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bs-blocking-ui-layer',
  templateUrl: './blocking-ui-layer.component.html',
  styleUrl: './blocking-ui-layer.component.css'
})
export class BlockingUiLayerComponent implements OnInit{
  ngOnInit(): void {
    const config = {
      with: '100%',
      height: '100%'
    };
  }
}
