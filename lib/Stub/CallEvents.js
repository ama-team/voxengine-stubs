var CallEvents = {}

function factory (name, defaults) {
  defaults = defaults || {}
  var fullName = 'Call.' + name
  var event = function (data) {
    var self = this
    data = data || {}
    Object.defineProperty(this, 'name', {value: fullName, writable: false})
    Object.keys(defaults).forEach(function (key) {
      self[key] = defaults[key]
    })
    Object.keys(data).forEach(function (key) {
      self[key] = data[key]
    })
  }
  event.name = fullName
  event._properties = Object.keys(defaults)
  CallEvents[name] = event
}

factory('AudioStarted', {call: {}, headers: {}})
factory('Connected', {call: {}, customData: ''})
factory('Disconnected', {call: {}, cost: 0, duration: 0, headers: {}})
factory('Failed', {call: {}, code: 486, headers: {}, reason: {}})
factory('FirstVideoPacket', {call: {}, url: {}})
factory('InfoReceived', {body: '', call: {}, headers: {}, mimeType: 'application/json'})
factory('MessageReceived', {call: {}, headers: {}, text: ''})
factory('MicStatusChange', {active: false, call: {}})
factory('OffHold', {call: {}})
factory('OnHold', {call: {}})
factory('PlaybackFinished', {call: {}, error: null})
factory('ReInviteAccepted', {body: '', call: {}, headers: {}, mimeType: 'application/json'})
factory('ReInviteReceived', {body: '', call: {}, headers: {}, mimeType: 'application/json'})
factory('ReInviteRejected', {call: {}, headers: {}})
factory('RecordStarted', {call: {}, url: ''})
factory('RecordStopped', {call: {}, url: ''})
factory('Ringing', {call: {}, headers: {}})
factory('Statistics', {call: {}})
factory('ToneDetected', {ProgressTone: true, VoicemailTone: false, call: {}})
factory('ToneReceived', {call: {}, tone: ''})
factory('TransferComplete', {call: {}})
factory('VideoTrackCreated', {call: {}, url: ''})
factory('VoicemailPromptDetected', {call: {}, pattern: ''})
factory('VoicemailPromptNotDetected', {call: {}, pattern: ''})
factory('VoicemailToneDetected', {call: {}, frequency: 0})
factory('VoicemailToneNotDetected', {call: {}})

module.exports = {
  CallEvents: CallEvents
}
