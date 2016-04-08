package cryptolearner.client.views;

import org.gwtbootstrap3.client.shared.event.CarouselSlidEvent;
import org.gwtbootstrap3.client.ui.Button;
import org.gwtbootstrap3.client.ui.Carousel;
import org.gwtbootstrap3.client.ui.CarouselControl;
import org.gwtbootstrap3.client.ui.CarouselSlide;
import org.gwtbootstrap3.client.ui.PageHeader;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;

import cryptolearner.client.events.MenuClickEvent;

public class MenuView extends Composite {

	private static MenuViewUiBinder uiBinder = GWT
			.create(MenuViewUiBinder.class);

	interface MenuViewUiBinder extends UiBinder<Widget, MenuView> {
	}

	public MenuView() {
		initWidget(uiBinder.createAndBindUi(this));
		carouselMenu.setInterval(0);
	}
	
	@UiField
	Button caesarChallengeOne;

	@UiField
	Carousel carouselMenu;
	
	@UiField
	CarouselControl leftControl;
	
	@UiField
	CarouselControl rightControl;
	
	@UiField
	CarouselSlide firstSlide;
	
	@UiField
	CarouselSlide lastSlide;
		
	@UiHandler("carouselMenu")
	void handleCarouselControl(CarouselSlidEvent event) {
		// display left control if left slide is not active
		leftControl.setVisible(!firstSlide.isActive());
		// display right control if right slide is not active
		rightControl.setVisible(!lastSlide.isActive());
	}
	
	@UiHandler(value = { "caesarChallengeOne", "caesarChallengeTwo", "caesarChallengeThree", 
			"subChallengeOne", "subChallengeTwo", "subChallengeThree", "vigChallengeOne",
			"vigChallengeTwo", "vigChallengeThree"})
	void buttonClick(ClickEvent event) {
		RootPanel.get().clear();
		PageHeader sample = new PageHeader();
		sample.setText("New Level");
		RootPanel.get().add(sample);
		Button back = new Button("Go back");
		back.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				RootPanel.get().clear();
				RootPanel.get().add(new MenuView());
			}
		});
		RootPanel.get().add(back);
	}

}
