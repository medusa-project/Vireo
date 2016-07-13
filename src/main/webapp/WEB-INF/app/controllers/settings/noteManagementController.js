vireo.controller("NoteManagementController", function ($controller, $scope, OrganizationRepo, DragAndDropListenerFactory, WorkflowStepRepo) {
    
    angular.extend(this, $controller("AbstractController", {$scope: $scope}));

    $scope.selectedOrganization = OrganizationRepo.getSelectedOrganization();
    
    $scope.$watch(
        "step",
        function handleStepChanged(newStep, oldStep) {
            $scope.resetNotes();

            $scope.dragControlListeners.getListener().model = $scope.step.aggregateNotes;
            $scope.dragControlListeners.getListener().trash.id = 'note-trash-' + $scope.step.id;
            $scope.dragControlListeners.getListener().confirm.remove.modal = '#notesConfirmRemoveModal-' + $scope.step.id;
        }
    );

    $scope.dragging = false;
    
    $scope.sortAction = "confirm";

    $scope.uploadAction = "confirm";
    
    $scope.resetNotes = function() {

        var position = 1;   
        angular.forEach($scope.step.aggregateNotes, function(note) {
            note.position = position;
            position++;
        });

        $scope.modalData = {
            overrideable: true,
            name: '',
            text: ''
        };
    };

    $scope.resetNotes();
    
    $scope.createNote = function() {
        WorkflowStepRepo.addNote($scope.step, $scope.modalData);
    };
    
    $scope.selectNote = function(index) {
        $scope.modalData = $scope.step.aggregateNotes[index];
    };
    
    $scope.editNote = function(index) {
        $scope.selectNote(index - 1);
        angular.element('#notesEditModal-' + $scope.step.id).modal('show');
    };
    
    $scope.updateNote = function() {
        WorkflowStepRepo.updateNote($scope.step, $scope.modalData);
    };

    $scope.removeNote = function() {
        WorkflowStepRepo.removeNote($scope.step, $scope.modalData);
    };

    $scope.reorderNotes = function(src, dest) {
        WorkflowStepRepo.reorderNote($scope.step, src, dest);
    };
    
    $scope.isEditable = function(note) {
        var editable = note.overrideable;
        if(!editable) {
            editable = note.originatingWorkflowStep == $scope.step.id && 
                       $scope.selectedOrganization.originalWorkflowSteps.indexOf(note.originatingWorkflowStep) > -1;
        }
        return editable;
    };

    $scope.openNewModal = function(id) {
        $scope.openModal('#notesNewModal-' + id);
    };

    $scope.dragControlListeners = DragAndDropListenerFactory.buildDragControls({
        trashId: 'note-trash-' + $scope.step.id,
        dragging: $scope.dragging,
        select: $scope.selectNote,
        model: $scope.step.aggregateNotes,
        confirm: '#notesConfirmRemoveModal-' + $scope.step.id, 
        reorder: $scope.reorderNotes,
        container: '#notes'
    });

});