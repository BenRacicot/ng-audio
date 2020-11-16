import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'sys-sound',
    templateUrl: './sys-sound.component.html',
    styleUrls: ['./sys-sound.component.scss']
})
export class SysSoundComponent implements OnInit, AfterViewInit, OnDestroy {
    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    private _AFID: number; // AnimationFrame ID
    private _data: Uint8Array; // final audio data in the standard format
    public audioDevice: MediaDeviceInfo;
    public source: any; // what is this
    public fbc: any; // analyser.frequencyBinCount
    public bands: any[] = []; // actual eq band objects for element height etc
    public audioContext = new AudioContext();
    public analyser = this.audioContext.createAnalyser();

    constructor() { }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void {
        this.getAudioDevice();
    }

    private getAudioDevice() {
        navigator.mediaDevices.enumerateDevices()
            .then((devices: MediaDeviceInfo[]) => {
                // get a specific device
                this.audioDevice = devices.find((device: MediaDeviceInfo) => {
                    return device.kind == "audiooutput" && device.label == "eqMac (Virtual)";
                });
                // We get the user media corresponding to the audio device we are willing to get
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        deviceId: { exact: this.audioDevice.deviceId }
                    }
                }).then((stream: MediaStream) => {
                    this.connectStream(stream);
                });
            })
    }

    public connectStream(stream: MediaStream) {
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;
        this.analyser.fftSize = 64;
        // IF STREAMS MUST be connected to an <audio> tag
        // this.audioElm.srcObject = stream;
        // this.audioElm.muted = true;

        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
        this.source = this.audioContext.createMediaStreamSource(stream);
        // this.source = this.audioContext.createMediaElementSource(this.audioElm);

        // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
        // MDN An AnalyserNode has exactly one input and one output. The node works even if the output is not connected.
        this.source.connect(this.analyser);

        // MDN: Note: As a consequence of calling createMediaStreamSource(),
        // audio playback from the media stream will be re-routed into the processing graph of the AudioContext.
        this.analyser.connect(this.audioContext.destination);

        // do we need to set status: "running"?
        this.audioContext.resume();

        this.frameLooper();
    }

    public frameLooper() {
        // may want to run outside of zone
        // (window as any).__Zone_disable_requestAnimationFrame = true; // may want to use
        this._AFID = requestAnimationFrame(() => this.frameLooper());
        // this.ngZone.runOutsideAngular(() => {
        //     window.requestAnimationFrame(timestamp => {
        //         let timerStart = timestamp || new Date().getTime();
        //         console.log(timerStart);
        //     });
        // });

        // how many values from analyser (the "buffer" size)
        this.fbc = this.analyser.frequencyBinCount;

        // frequency data is integers on a scale from 0 to 255.
        this._data = new Uint8Array(this.analyser.frequencyBinCount);

        // this.analyser.getByteFrequencyData(this._data);
        this.analyser.getByteTimeDomainData(this._data);

        console.log({ analyser: this.analyser });
        console.log({ frequencyBinCount: this.analyser.frequencyBinCount });
        console.log({ fbc: this.fbc });
        console.log({ _data: this._data });

        let bandsTemp = [];
        // calculate the height of each band element using frequency data
        for (var i = 0; i < this.fbc; i++) {
            bandsTemp.push({ height: this._data[i] });
        }
        this.bands = bandsTemp;
    }

    // optimize ngFor
    public trackByFn(index?: any, item?: { id: void }): void {
        if (index) {
            return index; // unique id corresponding to the item
        } else if (item) {
            return item.id; // unique id corresponding to the item
        }
    }

    public ngOnDestroy(): void {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
        cancelAnimationFrame(this._AFID);
        this._AFID = null;
    }
}
