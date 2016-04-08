package cryptolearner.client;

import org.gwtbootstrap3.client.ui.Button;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.RootPanel;

import cryptolearner.client.events.MenuClickEvent;
import cryptolearner.client.events.MenuClickEventHandler;
import cryptolearner.client.views.MenuView;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class CryptoLearnerWeb implements EntryPoint {
	/**
	 * This is the entry point method.
	 */
	@Override
	public void onModuleLoad() {
		EventBus eventBus = new SimpleEventBus();
		MenuView mv = new MenuView();
		RootPanel.get().add(mv);
	}
	
}
