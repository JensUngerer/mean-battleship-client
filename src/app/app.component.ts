import { SocketSendService } from './logic/communication/sendService/socket-send.service';
import { SocketReceiveService } from './logic/communication/receiveService/socket-receive.service';
import { Component, Inject, OnInit } from '@angular/core';
import { SocketService } from './logic/communication/socketService/socket.service';
import { WebSocketService } from './web-socket.service';

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    @Inject(WebSocketService)
    private webSocketService : WebSocketService,
    @Inject(SocketReceiveService)
    private socketReceiveService: SocketReceiveService,
    @Inject(SocketSendService) private socketSendService: SocketSendService,
    // @Inject(SocketService) private socketService: SocketService,
  ) {
  }
  ngOnInit(): void {
    const initPromise = this.webSocketService.init();
    initPromise.then(() => {
          this.socketReceiveService.init();
          const subject = this.webSocketService.registerReceive();
          this.socketSendService.init(subject);
    });
  }
}

