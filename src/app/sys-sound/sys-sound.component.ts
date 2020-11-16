import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'sys-sound',
    templateUrl: './sys-sound.component.html',
    styleUrls: ['./sys-sound.component.scss']
})
export class SysSoundComponent implements AfterViewInit, OnDestroy {
    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    private _AFID: number; // AnimationFrame ID
    private _source: any; // eventual stream source
    private _fbc: any; // frequencyBinCount

    private _data: Uint8Array; // final audio data in the standard format
    private _audioDevice: MediaDeviceInfo;
    private _audioContext = new AudioContext();
    private _analyser = this._audioContext.createAnalyser();

    public bands: any[] = []; // eq band objects for element height etc
    public freqs: number[];

    constructor() { }

    public ngAfterViewInit(): void {
        this.getAudioDevice();
    }

    private getAudioDevice() {
        navigator.mediaDevices.enumerateDevices()
            .then((devices: MediaDeviceInfo[]) => {
                // get your specific device (eqMac in this case)
                this._audioDevice = devices.find((device: MediaDeviceInfo) => {
                    return device.kind == "audiooutput" && device.label == "eqMac (Virtual)";
                });
                // getUserMedia corresponding to the audio device we've chosen (eqMac in this case)
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        deviceId: { exact: this._audioDevice.deviceId }
                    }
                }).then((stream: MediaStream) => {
                    this.connectStream(stream);
                });
            })
    }

    private connectStream(stream: MediaStream) {
        this._analyser.minDecibels = -90;
        this._analyser.maxDecibels = -10;
        this._analyser.fftSize = 32;

        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
        this._source = this._audioContext.createMediaStreamSource(stream);
        // this.source = this.audioContext.createMediaElementSource(this.audioElm);

        // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
        // MDN An AnalyserNode has exactly one input and one output. The node works even if the output is not connected.
        this._source.connect(this._analyser);

        // MDN: Note: As a consequence of calling createMediaStreamSource(),
        // audio playback from the media stream will be re-routed into the processing graph of the AudioContext.
        // this._analyser.connect(this.audioContext.destination);

        this.freqs = this.calcFreqs(this._analyser.context.sampleRate, this._analyser.fftSize);

        // set context.status: running
        this._audioContext.resume();

        this.frameLooper();
    }

    // Control the view
    private frameLooper() {
        // Opinion: Run requestAnimationFrame outside zone to perfectly optimize
        this._AFID = requestAnimationFrame(() => this.frameLooper());

        // how many values from analyser (the "buffer" size)
        this._fbc = this._analyser.frequencyBinCount;

        // frequency data is integers on a scale from 0 to 255
        this._data = new Uint8Array(this._analyser.frequencyBinCount);
        this._analyser.getByteFrequencyData(this._data);

        // this._data = new Float32Array(this._analyser.frequencyBinCount);
        // this._analyser.getFloatFrequencyData(this._data);

        // console.log({ analyser: this._analyser });
        // console.log({ frequencyBinCount: this._analyser.frequencyBinCount });
        // console.log({ fbc: this.fbc });
        // console.log({ _data: this._data });
        // console.log({ sampleRate: this.audioContext.sampleRate });

        let bandsTemp = [];
        // calculate the height of each band element using frequency data
        for (var i = 0; i < this._fbc; i++) {
            bandsTemp.push({ height: this._data[i] });
        }
        this.bands = bandsTemp;
    }

    // calculate the frequency resolutions being displayed - sampleRate/fftSize
    private calcFreqs(sampleRate, fftSize) {
        // const fqRange = this._analyser.context.sampleRate / this._analyser.fftSize; // ie. 48000 / 32 = 1500 (1500 across 32 bands)
        const bands = fftSize/2; // bands are half the fftSize
        let fqRange = sampleRate / bands;
        const div = fqRange / bands; //
        let allocated = [];

        for ( let i = 0, j = bands; i < j; i++ ) {
            fqRange = Math.round(fqRange - div);
            allocated.push(fqRange + '+');
        }
        // console.log(allocated.reverse());
        return allocated.reverse();
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
