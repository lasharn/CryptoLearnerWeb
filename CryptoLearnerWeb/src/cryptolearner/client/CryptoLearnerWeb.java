package cryptolearner.client;

import java.awt.Color;
import java.util.ArrayList;
import java.util.List;

import org.gwtbootstrap3.client.shared.event.CarouselSlidEvent;
import org.gwtbootstrap3.client.shared.event.CarouselSlidHandler;
import org.gwtbootstrap3.client.shared.event.CarouselSlideEvent;
import org.gwtbootstrap3.client.shared.event.CarouselSlideHandler;
import org.gwtbootstrap3.client.ui.Button;
import org.gwtbootstrap3.client.ui.Carousel;
import org.gwtbootstrap3.client.ui.CarouselControl;
import org.gwtbootstrap3.client.ui.CarouselIndicators;
import org.gwtbootstrap3.client.ui.CarouselInner;
import org.gwtbootstrap3.client.ui.CarouselSlide;
import org.gwtbootstrap3.client.ui.PageHeader;
import org.gwtbootstrap3.client.ui.constants.IconType;
import org.gwtbootstrap3.client.ui.html.Div;

import cryptolearner.shared.FieldVerifier;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class CryptoLearnerWeb implements EntryPoint {
	/**
	 * The message displayed to the user when the server cannot be reached or
	 * returns an error.
	 */
	private static final String SERVER_ERROR = "An error occurred while "
			+ "attempting to contact the server. Please check your network "
			+ "connection and try again.";

	/**
	 * This is the entry point method.
	 */
	@Override
	public void onModuleLoad() {
		
		// define carousel
		Carousel carouselMenu = new Carousel();
		carouselMenu.setId("menu");
		
		// define inner carousel
		CarouselInner carouselInner = new CarouselInner();
		
		// Caesar menu slide
		final CarouselSlide caesarSlide = createMenuCarouselSlide("Caesar Cipher");
		caesarSlide.setActive(true);
		carouselInner.add(caesarSlide);
		
		// Substitution menu slide
		final CarouselSlide subSlide = createMenuCarouselSlide("Substitution Cipher");
		carouselInner.add(subSlide);
				
		// Vigenere menu slide
		final CarouselSlide vigenereSlide = createMenuCarouselSlide("Vigenere Cipher");
		carouselInner.add(vigenereSlide);
		
		// add inner carousel to carousel
		carouselMenu.add(carouselInner);
		// stop auto cycling of carousel
		carouselMenu.setInterval(0);
		
		final CarouselControl rightControl = new CarouselControl();
		rightControl.setDataTarget("#menu");
		rightControl.setNext(true);
		rightControl.setIconType(IconType.CHEVRON_RIGHT);
		final CarouselControl leftControl = new CarouselControl();
		leftControl.setDataTarget("#menu");
		leftControl.setPrev(true);
		leftControl.setVisible(false);
		
		carouselMenu.add(leftControl);
		carouselMenu.add(rightControl);
		
		
		carouselMenu.addSlidHandler(new CarouselSlidHandler() {
			
			@Override
			public void onSlid(CarouselSlidEvent carouselSlideEvent) {
				// display left control if left slide is not active
				leftControl.setVisible(!caesarSlide.isActive());
				// display right control if right slide is not active
				rightControl.setVisible(!vigenereSlide.isActive());
			}
		});
		
		// Use RootPanel.get() to get the entire body element
		RootPanel.get("CarouselMenu").add(carouselMenu);
	}

	private CarouselSlide createMenuCarouselSlide(String slideTitle) {
		CarouselSlide slide = new CarouselSlide();
		
		// add header to slide
		PageHeader header = new PageHeader();
		header.setText(slideTitle);
		slide.add(header);
		
		// add separating div between header and buttons
		Div divider = new Div();
		divider.getElement().setAttribute("class", "divide100");
		
		// create container to hold all buttons
		Div parentBtnContainer = new Div();
		
		// create each button's individual container
		Div btnOneContainer = new Div();
		Div btnTwoContainer = new Div();
		Div btnThreeContainer = new Div();
		
		// define the values of the class attribute for buttons and their containers
		String containerClassValue = "col-lg-4 col-xs-12 col-md-4";
		String btnClassValue = "btn btn-default col-lg-11 col-xs-12 col-md-11";
		
		// set each container class type
		btnOneContainer.getElement().setAttribute("class", containerClassValue);
		btnTwoContainer.getElement().setAttribute("class", containerClassValue);
		btnThreeContainer.getElement().setAttribute("class", containerClassValue);
		
		// set first challenge button
		Button challengeOneBtn = new Button("Encrypt");
		challengeOneBtn.setIcon(IconType.PENCIL_SQUARE_O);
		challengeOneBtn.getElement().setAttribute("class", btnClassValue);
		
		// set second challenge button
		Button challengeTwoBtn = new Button();
		challengeTwoBtn.setIcon(IconType.LOCK);
		challengeTwoBtn.getElement().setAttribute("class", btnClassValue);
		
		// set third challenge button
		Button challengeThreeBtn = new Button();
		challengeThreeBtn.setIcon(IconType.LOCK);
		challengeThreeBtn.getElement().setAttribute("class", btnClassValue);
		
		// add each button to its container
		btnOneContainer.add(challengeOneBtn);
		btnTwoContainer.add(challengeTwoBtn);
		btnThreeContainer.add(challengeThreeBtn);
		
		// add each button container to the parent button container
		parentBtnContainer.add(btnOneContainer);
		parentBtnContainer.add(btnTwoContainer);
		parentBtnContainer.add(btnThreeContainer);
		
		// add divider and parent button container to the carousel slide
		slide.add(divider);
		slide.add(parentBtnContainer);
		return slide;
	}
}
