# Video

A standardized, accessible wrapper for HTML5 video playback, enforcing consistent rounded corners and background states.

## Import

    import { Video } from '@/components/ui/video/Video';

## Usage

    <Video
      src="https://example.com/video.mp4"
      poster="/images/thumbnail.jpg"
      muted
      loop
    />

## Props

| Prop          | Type      | Default             | Description                                       |
| ------------- | --------- | ------------------- | ------------------------------------------------- |
| `src`         | `string`  | (Required)          | The URL of the video file to play.                |
| `poster`      | `string`  | `undefined`         | An image URL to show before the video plays.      |
| `controls`    | `boolean` | `true`              | Shows default browser video controls if true.     |
| `autoPlay`    | `boolean` | `false`             | Starts playing the video automatically if true.   |
| `loop`        | `boolean` | `false`             | Loops the video continuously.                     |
| `muted`       | `boolean` | `false`             | Mutes the video audio.                            |
| `className`   | `string`  | `''`                | Additional utility classes to apply to container. |
| `data-testid` | `string`  | `'video-component'` | Test identifier for QA and unit tests.            |
