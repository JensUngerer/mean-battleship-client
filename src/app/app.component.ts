import { SocketSendService } from './logic/communication/sendService/socket-send.service';
import { SocketReceiveService } from './logic/communication/receiveService/socket-receive.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from './logic/communication/socketService/socket.service';
import { WebSocketService } from './web-socket.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(WebSocketService)
    private webSocketService : WebSocketService,
    @Inject(SocketReceiveService)
    private socketReceiveService: SocketReceiveService,
    @Inject(SocketSendService) private socketSendService: SocketSendService,
    // @Inject(SocketService) private socketService: SocketService,
  ) {
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }
  private subscription: Subscription;
  private isUiBlocked$: BehaviorSubject<boolean>;
  public isUiBlocked = false;

  private handleIsUiBlocked(newValue: boolean) {
    this.isUiBlocked = newValue;
  }


  ngOnInit(): void {
    const initPromise = this.webSocketService.init();
    initPromise.then((isUiBlocked$) => {
          this.isUiBlocked$ = isUiBlocked$;
          this.subscription = this.isUiBlocked$.pipe(tap(this.handleIsUiBlocked.bind(this))).subscribe();

          this.socketReceiveService.init(this.isUiBlocked$);
          const subject = this.webSocketService.registerReceive();
          this.socketSendService.init(subject);
    });
  }
}

