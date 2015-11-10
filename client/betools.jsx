Meteor.startup(() => {
    injectTapEventPlugin();
    ReactDOM.render(<App />, document.getElementById("render-target"));
});