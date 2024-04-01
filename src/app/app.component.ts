import { SocketSendService } from './logic/communication/sendService/socket-send.service';
import { SocketReceiveService } from './logic/communication/receiveService/socket-receive.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from './logic/communication/socketService/socket.service';
import { WebSocketService } from './web-socket.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GameService } from './logic/game/game.service';

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private gameService: GameService,
    @Inject(WebSocketService)
    private webSocketService : WebSocketService,
    @Inject(SocketReceiveService)
    private socketReceiveService: SocketReceiveService,
    @Inject(SocketSendService) private socketSendService: SocketSendService,
  ) {
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
    if (this.subscriptionIsUiBlockedByGameState) {
      this.subscriptionIsUiBlockedByGameState.unsubscribe();
    }
  }
  private subscription: Subscription;
  private subscriptionIsUiBlockedByGameState: Subscription;

  private isUiBlocked$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isUiBlockedByGameState$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  public isUiBlocked = false;

  private handleIsUiBlocked(newValue: boolean) {
    // DEBUGGING: show current state
    // console.log(this.isUiBlocked$.value + '-' + this.isUiBlockedByGameState$.value);
    this.isUiBlocked = this.isUiBlocked$.value /*|| this.isUiBlockedByGameState$.value;*/
  }


  ngOnInit(): void {
    this.subscription = this.isUiBlocked$.pipe(tap(this.handleIsUiBlocked.bind(this))).subscribe();
    this.subscriptionIsUiBlockedByGameState = this.isUiBlockedByGameState$.pipe(tap(this.handleIsUiBlocked.bind(this))).subscribe();
    this.gameService.setIsUiBlocked(this.isUiBlockedByGameState$);
    const initPromise = this.webSocketService.init(this.isUiBlocked$);
    initPromise.then(() => {
          this.socketReceiveService.init(this.isUiBlocked$);
          const subject = this.webSocketService.registerReceive();
          this.socketSendService.init(subject);
    });
  }
}

