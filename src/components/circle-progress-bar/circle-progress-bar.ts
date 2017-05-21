import { SymbolService } from './../../services/symbol.service';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the CircleProgressBar component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'circle-progress-bar',
  templateUrl: 'circle-progress-bar.html'
})
export class CircleProgressBar {

  @Input()
  public turnTime: number;
 
  
  public barR: number = 0.8;
  public strokeWidth: number = 0.2;
  public barStrokeDashoffset: number = 0;
  public readonly animation: string = "stroke-dashoffset 0.1s linear";
  public animationStyle: string = this.animation;

  private timer: number;

  constructor(private symbolService: SymbolService) {
    this.symbolService.percentChange.subscribe(val => {
      this.percentChanged(val);
    });
  }
  
  ngOnInit() {
    this.symbolService.startTime = performance.now();
    this.start(100);
  }

  // TODO: move it to service
  private start(interval: number) {

    this.animationStyle = "";
    this.symbolService.percent = 0;

    this.timer = setInterval(x => {
      let currentTime = performance.now();
      if (currentTime - this.symbolService.startTime >= this.turnTime) {
        this.symbolService.startTime = performance.now();
        // TODO: move it to service
        this.animationStyle = "";

        this.symbolService.next();
      } else {
        this.animationStyle = this.animation;
      }
      this.symbolService.percent = (currentTime - this.symbolService.startTime) / this.turnTime * 100;
    }, interval);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }


  public percentChanged(percent: number) {
    if (isNaN(percent)) {
      percent = 100;
    }
    else {
      var r = this.barR;
      var c = Math.PI * (r * 2);

      if (percent < 0) { percent = 0; }
      if (percent > 100) { percent = 100; }

      var pct = ((100 - percent) / 100) * c;

      this.barStrokeDashoffset = pct;
    }
  }
}
