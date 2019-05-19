import { SocketSendService } from './logic/communication/sendService/socket-send.service';
import { SocketReceiveService } from './logic/communication/receiveService/socket-receive.service';
import { Component } from '@angular/core';
import { SocketService } from './logic/communication/socketService/socket.service';

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private socketService: SocketService,
    private socketReceiveService: SocketReceiveService,
    private socketSendService: SocketSendService) {
    this.socketService.startGame();
  }
}
