suite('DragAndDrop', function() {
  // ======================================================
  test('test drag and drop properties and methods', function(done) {
    var stage = addStage();
    var layer = new Konva.Layer();
    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle'
    });

    stage.add(layer);
    layer.add(circle);

    setTimeout(function() {
      layer.draw();

      // test defaults
      assert.equal(circle.draggable(), false);

      //change properties
      circle.setDraggable(true);

      //circle.on('click', function(){});

      layer.draw();

      showHit(layer);

      // test new properties
      assert.equal(circle.getDraggable(), true);

      done();
    }, 50);
  });

  // ======================================================
  test('multiple drag and drop sets with setDraggable()', function() {
    var stage = addStage();
    var layer = new Konva.Layer();
    var circle = new Konva.Circle({
      x: 380,
      y: stage.getHeight() / 2,
      radius: 70,
      strokeWidth: 4,
      fill: 'red',
      stroke: 'black'
    });

    circle.setDraggable(true);
    assert.equal(circle.getDraggable(), true);
    circle.setDraggable(true);
    assert.equal(circle.getDraggable(), true);
    circle.setDraggable(false);
    assert.equal(!circle.getDraggable(), true);

    layer.add(circle);
    stage.add(layer);
  });

  // ======================================================
  test('right click is not for dragging', function() {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    layer.add(circle);
    stage.add(layer);

    stage.simulateMouseDown({
      x: 291,
      y: 112
    });

    stage.simulateMouseMove({
      x: 311,
      y: 112
    });

    assert(circle.isDragging(), 'dragging is ok');

    stage.simulateMouseUp({
      x: 291,
      y: 112
    });

    assert(!circle.isDragging(), 'drag stopped');

    stage.simulateMouseDown({
      x: 291,
      y: 112,
      button: 2
    });

    stage.simulateMouseMove({
      x: 311,
      y: 112,
      button: 2
    });

    assert(circle.isDragging() === false, 'no dragging with right click');

    Konva.dragButtons = [0, 2];
    stage.simulateMouseUp({
      x: 291,
      y: 112,
      button: 2
    });

    // simulate buttons change
    stage.simulateMouseDown({
      x: 291,
      y: 112,
      button: 2
    });

    stage.simulateMouseMove({
      x: 311,
      y: 112,
      button: 2
    });

    assert(circle.isDragging() === true, 'now dragging with right click');

    stage.simulateMouseUp({
      x: 291,
      y: 112,
      button: 2
    });
    Konva.dragButtons = [0];
  });

  // ======================================================
  test('while dragging do not draw hit', function() {
    var stage = addStage();

    var top = stage.content.getBoundingClientRect().top;

    var layer = new Konva.Layer();
    stage.add(layer);

    var dragLayer = new Konva.Layer();
    stage.add(dragLayer);

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    dragLayer.add(circle);
    dragLayer.draw();

    var rect = new Konva.Rect({
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      width: 50,
      height: 50,
      draggable: true
    });
    layer.add(rect);
    layer.draw();

    var shape = layer.getIntersection({
      x: 2,
      y: 2
    });

    assert.equal(shape, rect, 'rect is detected');

    stage.simulateMouseDown({
      x: stage.width() / 2,
      y: stage.height() / 2
    });

    stage.simulateMouseMove({
      x: stage.width() / 2 + 5,
      y: stage.height() / 2
    });

    // redraw layer. hit must be not touched for not dragging layer
    layer.draw();
    shape = layer.getIntersection({
      x: 2,
      y: 2
    });
    assert.equal(shape, rect, 'rect is still detected');

    assert(circle.isDragging(), 'dragging is ok');

    dragLayer.draw();
    shape = dragLayer.getIntersection({
      x: stage.width() / 2,
      y: stage.height() / 2
    });
    // as dragLayer under dragging we should not able to detect intersect
    assert.equal(!!shape, false, 'circle is not detected');

    stage.simulateMouseUp({
      x: 291,
      y: 112 + top
    });
  });

  // ======================================================
  test('it is possible to change layer while dragging', function() {
    var stage = addStage();

    var top = stage.content.getBoundingClientRect().top;

    var startDragLayer = new Konva.Layer();
    stage.add(startDragLayer);

    var endDragLayer = new Konva.Layer();
    stage.add(endDragLayer);

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    startDragLayer.add(circle);
    startDragLayer.draw();

    var rect = new Konva.Rect({
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      width: 50,
      height: 50,
      draggable: true
    });
    endDragLayer.add(rect);
    endDragLayer.draw();

    stage.simulateMouseDown({
      x: stage.width() / 2,
      y: stage.height() / 2
    });

    stage.simulateMouseMove({
      x: stage.width() / 2 + 5,
      y: stage.height() / 2
    });

    // change layer while dragging circle
    circle.moveTo(endDragLayer);
    // move rectange for test hit update
    rect.moveTo(startDragLayer);
    startDragLayer.draw();

    var shape = startDragLayer.getIntersection({
      x: 2,
      y: 2
    });
    assert.equal(shape, rect, 'rect is detected');

    assert(circle.isDragging(), 'dragging is ok');

    endDragLayer.draw();
    shape = endDragLayer.getIntersection({
      x: stage.width() / 2,
      y: stage.height() / 2
    });
    // as endDragLayer under dragging we should not able to detect intersect
    assert.equal(!!shape, false, 'circle is not detected');

    stage.simulateMouseUp({
      x: 291,
      y: 112 + top
    });
  });

  // ======================================================
  test('removing parent of draggable node should not throw error', function() {
    var stage = addStage();
    var layer = new Konva.Layer();
    stage.add(layer);
    var circle = new Konva.Circle({
      x: 380,
      y: stage.getHeight() / 2,
      radius: 70,
      strokeWidth: 4,
      fill: 'red',
      stroke: 'black',
      draggable: true
    });

    layer.add(circle);
    stage.simulateMouseMove({
      x: stage.width() / 2 + 5,
      y: stage.height() / 2
    });

    circle.startDrag();
    try {
      layer.destroy();
      assert.equal(true, true, 'no error, that is very good');
    } catch (e) {
      assert.equal(true, false, 'error happened');
    }
  });

  test('update hit on stage drag end', function(done) {
    var stage = addStage();

    stage.draggable(true);

    var layer = new Konva.Layer();
    stage.add(layer);

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle'
    });

    layer.add(circle);
    layer.draw();

    stage.simulateMouseDown({
      x: stage.width() / 2,
      y: stage.height() / 2
    });

    stage.simulateMouseMove({
      x: stage.width() / 2 - 50,
      y: stage.height() / 2
    });

    setTimeout(function() {
      assert.equal(stage.isDragging(), true);

      stage.simulateMouseUp({
        x: stage.width() / 2 - 50,
        y: stage.height() / 2
      });

      var shape = layer.getIntersection({
        x: stage.width() / 2 + 5,
        y: stage.height() / 2
      });

      assert.equal(shape, circle);
      done();
    }, 50);
  });

  test('removing shape while drag and drop should no throw error', function() {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    layer.add(circle);
    stage.add(layer);

    stage.simulateMouseDown({
      x: 291,
      y: 112
    });

    circle.remove();

    stage.simulateMouseMove({
      x: 311,
      y: 112
    });

    stage.simulateMouseUp({
      x: 291,
      y: 112,
      button: 2
    });
  });

  test('destroying shape while drag and drop should no throw error', function() {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    layer.add(circle);
    stage.add(layer);

    stage.simulateMouseDown({
      x: 291,
      y: 112
    });

    circle.destroy();

    stage.simulateMouseMove({
      x: 311,
      y: 112
    });

    stage.simulateMouseUp({
      x: 291,
      y: 112
    });
  });

  test('drag start should trigger before movement', function() {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: 70,
      y: 70,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    layer.add(circle);
    stage.add(layer);

    circle.on('dragstart', function() {
      assert.equal(circle.x(), 70);
      assert.equal(circle.y(), 70);
    });

    stage.simulateMouseDown({
      x: 70,
      y: 70
    });

    stage.simulateMouseMove({
      x: 100,
      y: 100
    });

    stage.simulateMouseUp({
      x: 100,
      y: 100
    });
  });

  test('drag with touch', function() {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: 70,
      y: 70,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    layer.add(circle);
    stage.add(layer);

    circle.on('dragstart', function() {
      assert.equal(circle.x(), 70);
      assert.equal(circle.y(), 70);
    });

    stage.simulateTouchStart({
      x: 70,
      y: 70
    });

    stage.simulateTouchMove({
      x: 100,
      y: 100
    });

    stage.simulateTouchEnd({
      x: 100,
      y: 100
    });
    assert.equal(circle.x(), 100);
    assert.equal(circle.y(), 100);
  });

  test('drag with multi-touch (second finger on empty space)', function() {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: 70,
      y: 70,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    layer.add(circle);
    stage.add(layer);

    circle.on('dragstart', function() {
      assert.equal(circle.x(), 70);
      assert.equal(circle.y(), 70);
    });

    stage.simulateTouchStart([
      {
        x: 70,
        y: 70,
        id: 0
      },
      {
        x: 270,
        y: 270,
        id: 1
      }
    ]);

    stage.simulateTouchMove([
      {
        x: 100,
        y: 100,
        id: 0
      },
      {
        x: 270,
        y: 270,
        id: 1
      }
    ]);

    stage.simulateTouchEnd([
      {
        x: 100,
        y: 100,
        id: 0
      },
      {
        x: 270,
        y: 270,
        id: 1
      }
    ]);
    assert.equal(circle.x(), 100);
    assert.equal(circle.y(), 100);
  });

  test('drag with multi-touch (two shapes)', function() {
    var stage = addStage();
    var layer = new Konva.Layer();
    stage.add(layer);

    var circle1 = new Konva.Circle({
      x: 70,
      y: 70,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });
    layer.add(circle1);

    var circle2 = new Konva.Circle({
      x: 270,
      y: 70,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });
    layer.add(circle2);
    layer.draw();

    var dragstart1 = 0;
    var dragmove1 = 0;
    circle1.on('dragstart', function() {
      dragstart1 += 1;
    });
    circle1.on('dragmove', function() {
      dragmove1 += 1;
    });

    var dragstart2 = 0;
    var dragmove2 = 0;
    circle2.on('dragstart', function() {
      dragstart2 += 1;
    });

    circle2.on('dragmove', function() {
      dragmove2 += 1;
    });

    stage.simulateTouchStart([
      {
        x: 70,
        y: 70,
        id: 0
      },
      {
        x: 270,
        y: 70,
        id: 1
      }
    ]);

    // move one finger
    stage.simulateTouchMove([
      {
        x: 100,
        y: 100,
        id: 0
      },
      {
        x: 270,
        y: 70,
        id: 1
      }
    ]);

    assert.equal(dragstart1, 1);
    assert.equal(circle1.isDragging(), true);
    assert.equal(dragmove1, 1);
    assert.equal(circle1.x(), 100);
    assert.equal(circle1.y(), 100);

    // move second finger
    stage.simulateTouchMove([
      {
        x: 100,
        y: 100,
        id: 0
      },
      {
        x: 290,
        y: 70,
        id: 1
      }
    ]);

    assert.equal(dragstart2, 1);
    assert.equal(circle2.isDragging(), true);
    assert.equal(dragmove2, 1);
    assert.equal(circle2.x(), 290);
    assert.equal(circle2.y(), 70);

    // remove first finger
    stage.simulateTouchEnd(
      [
        {
          x: 290,
          y: 70,
          id: 1
        }
      ],
      [
        {
          x: 100,
          y: 100,
          id: 0
        }
      ]
    );
    assert.equal(circle1.isDragging(), false);
    assert.equal(circle2.isDragging(), true);
    assert.equal(Konva.DD.isDragging, true);
    // remove first finger
    stage.simulateTouchEnd(
      [],
      [
        {
          x: 290,
          y: 70,
          id: 1
        }
      ]
    );
    assert.equal(circle2.isDragging(), false);
    assert.equal(Konva.DD.isDragging, false);
  });

  test('drag with multi-touch (same shape)', function() {
    var stage = addStage();
    var layer = new Konva.Layer();
    stage.add(layer);

    var circle1 = new Konva.Circle({
      x: 70,
      y: 70,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });
    layer.add(circle1);
    layer.draw();

    var dragstart1 = 0;
    var dragmove1 = 0;
    circle1.on('dragstart', function() {
      dragstart1 += 1;
    });
    circle1.on('dragmove', function() {
      dragmove1 += 1;
    });

    stage.simulateTouchStart([
      {
        x: 70,
        y: 70,
        id: 0
      }
    ]);
    // move one finger
    stage.simulateTouchMove([
      {
        x: 75,
        y: 75,
        id: 0
      }
    ]);

    stage.simulateTouchStart(
      [
        {
          x: 75,
          y: 75,
          id: 0
        },
        {
          x: 80,
          y: 80,
          id: 1
        }
      ],
      [
        {
          x: 80,
          y: 80,
          id: 1
        }
      ]
    );

    stage.simulateTouchMove(
      [
        {
          x: 75,
          y: 75,
          id: 0
        },
        {
          x: 85,
          y: 85,
          id: 1
        }
      ],
      [
        {
          x: 85,
          y: 85,
          id: 1
        }
      ]
    );

    assert.equal(dragstart1, 1);
    assert.equal(circle1.isDragging(), true);
    assert.equal(dragmove1, 1);
    assert.equal(circle1.x(), 75);
    assert.equal(circle1.y(), 75);

    // remove first finger
    stage.simulateTouchEnd(
      [],
      [
        {
          x: 75,
          y: 75,
          id: 0
        },
        {
          x: 85,
          y: 85,
          id: 1
        }
      ]
    );
  });
  // TODO: try to move two shapes on different stages

  test('can stop drag on dragstart without changing position later', function() {
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: 70,
      y: 70,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true
    });

    layer.add(circle);
    stage.add(layer);

    circle.on('dragstart', function() {
      circle.stopDrag();
    });
    circle.on('dragmove', function() {
      assert.equal(false, true, 'dragmove called!');
    });

    stage.simulateMouseDown({
      x: 70,
      y: 70
    });

    stage.simulateMouseMove({
      x: 100,
      y: 100
    });

    stage.simulateMouseUp({
      x: 100,
      y: 100
    });

    assert.equal(circle.x(), 70);
    assert.equal(circle.y(), 70);
  });
});
