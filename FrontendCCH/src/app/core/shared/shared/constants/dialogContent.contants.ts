interface DialogContent {
  title: string;
  message: string;
}

export const UNSAVED_FORM_CHANGES: DialogContent = {
  title: 'Cambios sin guardar',
  message:
    '!Si sales del formulario ahora, no se guardará ningún cambio! ¿Estás seguro que deseas continuar?',
};

export const DELETE_FORM_CHANGES: DialogContent = {
  title: 'Eliminar unidad',
  message:
    '¿Estás seguro que deseas eliminar a esta unidad del catálogo de unidades?',
};

