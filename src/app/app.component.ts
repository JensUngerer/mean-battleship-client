import { SocketSendService } from './logic/communication/sendService/socket-send.service';
import { SocketReceiveService } from './logic/communication/receiveService/socket-receive.service';
import { Component, Inject } from '@angular/core';
import { SocketService } from './logic/communication/socketService/socket.service';

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    @Inject(SocketReceiveService)
    private socketReceiveService: SocketReceiveService,
    @Inject(SocketSendService) private socketSendService: SocketSendService,
    @Inject(SocketService) private socketService: SocketService,
  ) {
    this.socketService.startGame();
  }
}

