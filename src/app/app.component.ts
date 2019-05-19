import { Component } from '@angular/core';
import { SocketService } from './logic/communication/socketService/socket.service';

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private socketService: SocketService) {

  }
}
