package cryptolearner.client.events;

import com.google.gwt.event.shared.*;

public class MenuClickEvent extends GwtEvent<MenuClickEventHandler>{

	public static Type<MenuClickEventHandler> TYPE = new Type<MenuClickEventHandler>();
	@Override
	public Type<MenuClickEventHandler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(MenuClickEventHandler handler) {
		handler.NavigateOnClick(this);
	}

}
