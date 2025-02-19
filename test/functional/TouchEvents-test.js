suite('TouchEvents', function() {
  // ======================================================
  test('stage content touch events', function() {
    var stage = addStage();
    var layer = new Konva.Layer();
    var circle = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle'
    });

    layer.add(circle);
    stage.add(layer);

    var circleTouchstart = (circleTouchend = stageContentTouchstart = stageContentTouchend = stageContentTouchmove = stageContentTap = stageContentDbltap = 0);

    var top = stage.content.getBoundingClientRect().top;

    circle.on('touchstart', function() {
      circleTouchstart++;
    });

    circle.on('touchend', function() {
      circleTouchend++;
    });

    stage.on('contentTouchstart', function() {
      stageContentTouchstart++;
    });

    stage.on('contentTouchend', function() {
      stageContentTouchend++;
    });

    stage.on('contentTouchmove', function() {
      stageContentTouchmove++;
    });

    stage.on('contentTap', function() {
      stageContentTap++;
    });

    stage.on('contentDbltap', function() {
      stageContentDbltap++;
    });

    stage.simulateTouchStart([{ x: 100, y: 100, id: 0 }]);

    stage.simulateTouchEnd([], [{ x: 100, y: 100, id: 0 }]);
    assert.equal(circleTouchstart, 1, 1);
    assert.equal(circleTouchend, 1, 2);
    assert.equal(stageContentTouchstart, 1, 3);
    assert.equal(stageContentTouchend, 1, 4);
    assert.equal(stageContentDbltap, 0, 5);

    stage.simulateTouchStart([{ x: 1, y: 1, id: 0 }]);

    stage.simulateTouchEnd([], [{ x: 1, y: 1, id: 0 }]);

    assert.equal(stageContentTouchstart, 2, 6);
    assert.equal(stageContentTouchend, 2, 7);
    assert.equal(stageContentDbltap, 1, 8);
  });

  // ======================================================
  test('touchstart touchend touchmove tap dbltap', function(done) {
    var stage = addStage();
    var layer = new Konva.Layer();
    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4
    });

    // mobile events
    var touchstart = false;
    var touchend = false;
    var tap = false;
    var touchmove = false;
    var dbltap = false;

    /*
     * mobile
     */
    circle.on('touchstart', function() {
      touchstart = true;
      //log('touchstart');
      //alert('touchstart')
    });

    circle.on('touchend', function() {
      touchend = true;
      //alert('touchend')
      //log('touchend');
    });

    circle.on('touchmove', function() {
      touchmove = true;
      //log('touchmove');
    });

    circle.on('tap', function(evt) {
      tap = true;
      //log('tap');
    });

    circle.on('dbltap', function() {
      dbltap = true;
      //log('dbltap');
    });

    layer.add(circle);
    stage.add(layer);

    var top = stage.content.getBoundingClientRect().top;

    // reset inDoubleClickWindow
    Konva.inDblClickWindow = false;

    // touchstart circle
    stage.simulateTouchStart([{ x: 289, y: 100, id: 0 }]);

    assert(touchstart, '8) touchstart should be true');
    assert(!touchmove, '8) touchmove should be false');
    assert(!touchend, '8) touchend should be false');
    assert(!tap, '8) tap should be false');
    assert(!dbltap, '8) dbltap should be false');

    // touchend circle
    stage.simulateTouchEnd([], [{ x: 289, y: 100, id: 0 }]);
    // end drag is tied to document mouseup and touchend event
    // which can't be simulated.  call _endDrag manually
    //Konva.DD._endDrag();

    assert(touchstart, '9) touchstart should be true');
    assert(!touchmove, '9) touchmove should be false');
    assert(touchend, '9) touchend should be true');
    assert(tap, '9) tap should be true');
    assert(!dbltap, '9) dbltap should be false');

    // touchstart circle
    stage.simulateTouchStart([{ x: 289, y: 100, id: 0 }]);

    assert(touchstart, '10) touchstart should be true');
    assert(!touchmove, '10) touchmove should be false');
    assert(touchend, '10) touchend should be true');
    assert(tap, '10) tap should be true');
    assert(!dbltap, '10) dbltap should be false');

    // touchend circle to triger dbltap
    stage.simulateTouchEnd([], [{ x: 289, y: 100, id: 0 }]);
    // end drag is tied to document mouseup and touchend event
    // which can't be simulated.  call _endDrag manually
    //Konva.DD._endDrag();

    assert(touchstart, '11) touchstart should be true');
    assert(!touchmove, '11) touchmove should be false');
    assert(touchend, '11) touchend should be true');
    assert(tap, '11) tap should be true');
    assert(dbltap, '11) dbltap should be true');

    setTimeout(function() {
      // touchmove circle
      stage.simulateTouchMove([], [{ x: 289, y: 100, id: 0 }]);

      assert(touchstart, '12) touchstart should be true');
      assert(touchmove, '12) touchmove should be true');
      assert(touchend, '12) touchend should be true');
      assert(tap, '12) tap should be true');
      assert(dbltap, '12) dbltap should be true');

      done();
    }, 17);
  });

  // test for https://github.com/konvajs/konva/issues/156
  test('touchstart out of shape, then touch end inside shape', function() {
    var stage = addStage();
    var layer = new Konva.Layer();
    var circle = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle'
    });

    layer.add(circle);
    stage.add(layer);

    var circleTouchend = (stageContentTouchstart = stageContentTouchend = 0);

    var top = stage.content.getBoundingClientRect().top;

    circle.on('touchend', function() {
      circleTouchend++;
    });

    stage.on('contentTouchstart', function() {
      stageContentTouchstart++;
    });

    stage.on('contentTouchend', function() {
      stageContentTouchend++;
    });

    stage.simulateTouchStart([{ x: 1, y: 1, id: 0 }]);
    stage.simulateTouchEnd([], [{ x: 100, y: 100, id: 0 }]);

    assert.equal(stageContentTouchstart, 1);
    assert.equal(stageContentTouchend, 1);
    assert.equal(circleTouchend, 1);
  });

  test('tap on one shape, then fast tap on another shape should no trigger double tap', function() {
    var stage = addStage();
    var layer = new Konva.Layer();
    stage.add(layer);

    var circle1 = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle'
    });

    layer.add(circle1);

    var circle2 = new Konva.Circle({
      x: 200,
      y: 100,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle'
    });

    layer.add(circle2);

    layer.draw();

    var circle1Tap = 0;
    var circle2Tap = 0;
    var circle2DoubleTap = 0;

    circle1.on('tap', function() {
      circle1Tap++;
    });
    circle2.on('tap', function() {
      circle2Tap++;
    });
    circle2.on('dbltap', function() {
      circle2DoubleTap++;
    });

    stage.simulateTouchStart({ x: 100, y: 100 });
    stage.simulateTouchEnd({ x: 100, y: 100 });

    assert.equal(circle1Tap, 1, 'should trigger tap on first circle');
    assert.equal(circle2Tap, 0, 'should NOT trigger tap on second circle');
    assert.equal(
      circle2DoubleTap,
      0,
      'should NOT trigger dbltap on second circle'
    );

    stage.simulateTouchStart({ x: 200, y: 100 });
    stage.simulateTouchEnd({ x: 200, y: 100 });

    assert.equal(circle1Tap, 1, 'should trigger tap on first circle');
    assert.equal(circle2Tap, 1, 'should trigger tap on second circle');
    assert.equal(
      circle2DoubleTap,
      0,
      'should NOT trigger dbltap on second circle'
    );
  });

  test('multitouch - register all touches', function() {
    var stage = addStage();
    var layer = new Konva.Layer();
    stage.add(layer);

    var circle1 = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle1',
      draggable: true
    });
    layer.add(circle1);

    var circle2 = new Konva.Circle({
      x: 100,
      y: 200,
      radius: 80,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle2',
      draggable: true
    });

    layer.add(circle2);
    layer.draw();

    var touchStart = 0;
    var touchMove = 0;
    var touchEnd = 0;
    var touchEnd2 = 0;

    circle1.on('touchstart', function() {
      touchStart++;
    });
    circle1.on('touchmove', function() {
      touchMove++;
    });
    circle1.on('touchend', function() {
      touchEnd++;
    });

    circle2.on('touchend', function() {
      touchEnd2++;
    });

    var stageTouchStart = 0;
    var stageTouchMove = 0;
    var stageTouchEnd = 0;
    stage.on('touchstart', function() {
      stageTouchStart++;
    });
    stage.on('touchmove', function() {
      stageTouchMove++;
    });
    stage.on('touchend', function() {
      stageTouchEnd++;
    });

    // start with one touch
    stage.simulateTouchStart(
      [{ x: 100, y: 100, id: 0 }],
      [{ x: 100, y: 100, id: 0 }]
    );

    assert.equal(stageTouchStart, 1, 'trigger first touch start on stage');
    assert.equal(touchStart, 1, 'trigger first touch start on circle');

    // make second touch
    stage.simulateTouchStart(
      [{ x: 100, y: 100, id: 0 }, { x: 210, y: 100, id: 1 }],
      [{ x: 210, y: 100, id: 1 }]
    );

    assert.equal(
      stageTouchStart,
      2,
      'should trigger the second touch on stage'
    );
    assert.equal(
      touchStart,
      1,
      'should not trigger the second touch start (it is outside)'
    );

    // now try to make two touches at the same time
    // TODO: should we trigger touch end first?
    stage.simulateTouchStart(
      [{ x: 100, y: 100, id: 0 }, { x: 210, y: 100, id: 1 }],
      [{ x: 100, y: 100, id: 0 }, { x: 210, y: 100, id: 1 }]
    );

    assert.equal(stageTouchStart, 3, 'should trigger one more touch');
    assert.equal(
      touchStart,
      2,
      'should trigger the second touch start on the circle'
    );

    // check variables
    assert.deepEqual(stage.getPointerPosition(), { x: 100, y: 100 });
    assert.deepEqual(stage.getPointersPositions(), [
      { x: 100, y: 100, id: 0 },
      { x: 210, y: 100, id: 1 }
    ]);

    // move one finger
    stage.simulateTouchMove(
      [{ x: 100, y: 100, id: 0 }, { x: 220, y: 100, id: 1 }],
      [{ x: 220, y: 100, id: 1 }]
    );
    assert.equal(touchMove, 0, 'should not trigger touch move on circle');
    assert.equal(stageTouchMove, 1, 'should trigger touch move on stage');

    // move two fingers
    stage.simulateTouchMove(
      [{ x: 100, y: 100, id: 0 }, { x: 220, y: 100, id: 1 }],
      [{ x: 100, y: 100, id: 0 }, { x: 220, y: 100, id: 1 }]
    );
    assert.equal(touchMove, 1, 'should trigger touch move on circle');
    assert.equal(
      stageTouchMove,
      2,
      'should trigger two more touchmoves on stage'
    );

    stage.simulateTouchEnd(
      [],
      [{ x: 100, y: 100, id: 0 }, { x: 220, y: 100, id: 1 }]
    );
    assert.equal(touchEnd, 1);
    assert.equal(stageTouchEnd, 1);

    // try two touch ends on both shapes
    stage.simulateTouchEnd(
      [],
      [{ x: 100, y: 100, id: 0 }, { x: 100, y: 170, id: 1 }]
    );

    assert.equal(touchEnd, 2);
    assert.equal(touchEnd2, 1);
    // TODO: it should be 2, not 3
    assert.equal(stageTouchEnd, 3);
  });

  test('can capture touch events', function() {
    Konva.captureTouchEventsEnabled = true;
    var stage = addStage();
    var layer = new Konva.Layer();
    stage.add(layer);

    var circle1 = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle1'
    });
    layer.add(circle1);

    layer.draw();

    var touchStart = 0;
    var touchMove = 0;
    var touchEnd = 0;

    circle1.on('touchstart', function(e) {
      touchStart++;
    });
    circle1.on('touchmove', function() {
      touchMove++;
    });
    circle1.on('touchend', function() {
      touchEnd++;
    });

    stage.simulateTouchStart(
      [{ x: 100, y: 100, id: 0 }],
      [{ x: 100, y: 100, id: 0 }]
    );

    // go out of circle
    stage.simulateTouchMove(
      [{ x: 180, y: 100, id: 0 }],
      [{ x: 180, y: 100, id: 0 }]
    );
    assert.equal(touchMove, 1, 'first touchmove');

    // add another finger
    stage.simulateTouchStart(
      [{ x: 180, y: 100, id: 0 }, { x: 100, y: 100, id: 1 }],
      [{ x: 100, y: 100, id: 1 }]
    );

    // move all out
    stage.simulateTouchMove(
      [{ x: 185, y: 100, id: 0 }, { x: 190, y: 100, id: 1 }],
      [{ x: 185, y: 100, id: 0 }, { x: 190, y: 100, id: 1 }]
    );
    // should trigger just one more touchmove
    assert.equal(touchMove, 2, 'second touchmove');

    // remove fingers
    stage.simulateTouchEnd(
      [],
      [{ x: 185, y: 100, id: 0 }, { x: 190, y: 100, id: 1 }]
    );

    assert.equal(touchEnd, 1, 'first touchend');

    // should release captures on touchend
    assert.equal(circle1.hasPointerCapture(0), false);
    assert.equal(circle1.hasPointerCapture(1), false);

    Konva.captureTouchEventsEnabled = false;
  });
});
