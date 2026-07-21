export interface DialogData {
    title: string;
    message : string;
}

export const DELETE_DIALOG_PRODUCT: DialogData = {
  title: 'Eliminar producto',
  message:
    '¿Estás seguro que deseas eliminar a este producto?',
};

export const DELETE_DIALOG_CONTACT: DialogData = {
  title: 'Eliminar contacto',
  message:
    '¿Estás seguro que deseas eliminar a este contacto?',
};


export const NOT_FOUND_DIALOG: DialogData = {
  title: 'No encontrado',
  message:
    'El registro que está tratando de buscar no existe',
};

export const UNSAVED_DIALOG: DialogData = {
    title: 'Cambios sin guardar',
    message:
      'Si cierras ahora no se guardará ningún cambio. ¿Estás seguro que deseas continuar?',
  };  

  export const SAVED_DIALOG: DialogData = {
    title: 'Guardar',
    message:
      '¿Seguro que deseas guardar los cambios?',
  };  

  export const SAVED_INVALID_DIALOG: DialogData = {
    title: 'Guardar',
    message:
      '¿Aún hay campos sin llenar, ¿seguro que deseas guardar los cambios?',
  };  


